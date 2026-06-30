class Order < ApplicationRecord
  # An order bundles one or more reward recipients under a campaign.
  has_many :recipients, dependent: :destroy

  # Build/clear recipients through the order in one request payload.
  accepts_nested_attributes_for :recipients

  validates :public_id, presence: true, uniqueness: true
  validates :currency, presence: true

  # Generate a Tremendous-style public id (e.g. "81EKD82OE9L8") before saving.
  before_validation :assign_public_id, on: :create

  # Keep money totals consistent with the recipients on the order.
  before_save :recalculate_totals

  default_scope { order(created_at: :desc) }

  # Characters used for the public id — base32-ish, no easily-confused 0/O/1/I.
  PUBLIC_ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".chars.freeze
  PUBLIC_ID_LENGTH = 12

  private

  def assign_public_id
    return if public_id.present?

    self.public_id = loop do
      candidate = Array.new(PUBLIC_ID_LENGTH) { PUBLIC_ID_ALPHABET.sample }.join
      break candidate unless Order.exists?(public_id: candidate)
    end
  end

  def recalculate_totals
    self.subtotal_cents = recipients.reject(&:marked_for_destruction?).sum { |r| r.amount_cents.to_i }
    self.total_cents = subtotal_cents
  end
end
