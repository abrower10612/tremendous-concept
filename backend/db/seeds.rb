# Seeds for the Tremendous concept app. Idempotent: clears and re-creates so
# `bin/rails db:seed` always yields the same known state.

puts "Clearing existing data..."
Recipient.delete_all
Order.delete_all
Contact.delete_all

# ---------------------------------------------------------------------------
# Contacts — the three saved people shown in the "Add from Contacts" flow.
# ---------------------------------------------------------------------------
puts "Seeding contacts..."
contacts = [
  { name: "John Doe",     email: "example@gmail.com",  phone: "+1 (555) 010-1001" },
  { name: "Jane Doe",     email: "example2@gmail.com", phone: "+1 (555) 010-1002" },
  { name: "Mark Johnson", email: "example3@gmail.com", phone: "+1 (555) 010-1003" },
]
contacts.each { |attrs| Contact.create!(attrs) }

# ---------------------------------------------------------------------------
# Order history — backdated orders so the history screen looks populated,
# mirroring the reference screenshot (16 orders, mixed email / text).
# ---------------------------------------------------------------------------
puts "Seeding order history..."

PLACED_BY_NAME  = "Andrew Brower"
PLACED_BY_EMAIL = "admin@kaveotech.com"
PAYMENT_LABEL   = "COASTAL COMMUNITY BANK *****6244"
CAMPAIGN        = "Generic Thank You"

# [public_id, order_type, dollars, date]
history = [
  ["81EKD82OE9L8", "Digital - Email",        1,  "2026-06-30"],
  ["UIN7E6DUQK61", "Digital - Email",        20, "2026-06-30"],
  ["FZBO9U16I9VK", "Digital - Email",        20, "2026-06-29"],
  ["PQZYOBQ5RHA9", "Digital - Email",        20, "2026-06-10"],
  ["G8EOCVNVO2RN", "Digital - Email",        20, "2026-06-10"],
  ["0QQA45JZDGI5", "Digital - Email",        10, "2026-06-09"],
  ["P4141JCU813O", "Digital - Email",        20, "2026-06-09"],
  ["C0H6XME7EKJQ", "Digital - Text message", 25, "2026-04-06"],
  ["30Q3FJ9Q4T8V", "Digital - Text message", 100, "2026-04-06"],
  ["V08QCROP9CTP", "Digital - Email",        50, "2026-04-03"],
  ["LB7FMPOYB1M3", "Digital - Email",        25, "2026-03-03"],
  ["ER2B2B6J8Q5K", "Digital - Text message", 50, "2026-02-20"],
  ["T7XO70GZE31W", "Digital - Text message", 25, "2026-02-20"],
  ["05VV6TPJTG1Z", "Digital - Text message", 25, "2026-02-06"],
  ["0Q025F6MW9CX", "Digital - Text message", 25, "2026-01-30"],
  ["W2KD90ALQ3MN", "Digital - Email",        25, "2026-01-15"],
]

history.each_with_index do |(public_id, order_type, dollars, date), i|
  placed_at = Time.zone.parse("#{date} 13:#{format('%02d', i)}:00")
  order = Order.new(
    public_id: public_id,
    order_type: order_type,
    status: "complete",
    campaign_name: CAMPAIGN,
    products_included: "Virtual Visa",
    payment_method_label: PAYMENT_LABEL,
    currency: "USD",
    placed_by_name: PLACED_BY_NAME,
    placed_by_email: PLACED_BY_EMAIL,
    created_at: placed_at,
    updated_at: placed_at,
  )
  order.recipients.build(
    name: "Recipient #{i + 1}",
    email: "recipient#{i + 1}@example.com",
    amount_cents: dollars * 100,
    currency: "USD",
  )
  order.save!
end

puts "Done. #{Contact.count} contacts, #{Order.count} orders, total $#{'%.2f' % (Order.sum(:total_cents) / 100.0)}."
