# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_06_30_211356) do
  create_table "contacts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "name", null: false
    t.string "phone"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_contacts_on_email"
  end

  create_table "orders", force: :cascade do |t|
    t.string "campaign_name"
    t.datetime "created_at", null: false
    t.string "currency", default: "USD", null: false
    t.string "external_id"
    t.string "order_type", default: "Digital - Email", null: false
    t.string "payment_method_label"
    t.string "placed_by_email"
    t.string "placed_by_name"
    t.string "products_included"
    t.string "public_id", null: false
    t.string "status", default: "complete", null: false
    t.integer "subtotal_cents", default: 0, null: false
    t.integer "total_cents", default: 0, null: false
    t.datetime "updated_at", null: false
    t.index ["public_id"], name: "index_orders_on_public_id", unique: true
  end

  create_table "recipients", force: :cascade do |t|
    t.integer "amount_cents", default: 0, null: false
    t.datetime "created_at", null: false
    t.string "currency", default: "USD", null: false
    t.string "email", null: false
    t.string "name"
    t.integer "order_id", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_recipients_on_order_id"
  end

  add_foreign_key "recipients", "orders"
end
