class CreateRecipients < ActiveRecord::Migration[8.1]
  def change
    create_table :recipients do |t|
      t.references :order, null: false, foreign_key: true
      t.string :name
      t.string :email, null: false
      t.integer :amount_cents, null: false, default: 0
      t.string :currency, null: false, default: "USD"

      t.timestamps
    end
  end
end
