class Contact < ApplicationRecord
  # A saved person the user can quickly re-add as a reward recipient.
  EMAIL_REGEX = /\A[^@\s]+@[^@\s]+\z/

  validates :name, presence: true
  validates :email, presence: true, format: { with: EMAIL_REGEX }

  # Newest first by default so freshly-added contacts surface at the top.
  scope :alphabetical, -> { order(:name) }

  default_scope { order(created_at: :desc) }
end
