class Recipient < ApplicationRecord
  # One reward line on an order: who gets paid and how much.
  belongs_to :order

  validates :email, presence: true
  validates :amount_cents, numericality: { greater_than: 0 }
end
