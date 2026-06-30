class CreateOrders < ActiveRecord::Migration[8.1]
  def change
    create_table :orders do |t|
      # Tremendous-style public order identifier (e.g. "81EKD82OE9L8").
      t.string :public_id, null: false
      t.string :order_type, null: false, default: "Digital - Email"
      t.string :status, null: false, default: "complete"
      t.string :campaign_name
      t.string :products_included
      t.string :payment_method_label
      t.string :currency, null: false, default: "USD"
      t.integer :subtotal_cents, null: false, default: 0
      t.integer :total_cents, null: false, default: 0
      t.string :external_id
      t.string :placed_by_name
      t.string :placed_by_email

      t.timestamps
    end

    add_index :orders, :public_id, unique: true
  end
end
