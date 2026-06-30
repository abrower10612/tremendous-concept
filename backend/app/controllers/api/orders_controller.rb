module Api
  class OrdersController < ApplicationController
    # Fixed account context for this concept (single implied team/user).
    PLACED_BY_NAME  = "Jordan Avery".freeze
    PLACED_BY_EMAIL = "admin@northwindlabs.com".freeze
    DEFAULT_PAYMENT = "EVERGREEN FEDERAL BANK *****7731".freeze

    # GET /api/orders
    def index
      render json: Order.all.map { |o| summary(o) }
    end

    # GET /api/orders/:public_id
    def show
      order = Order.includes(:recipients).find_by!(public_id: params[:public_id])
      render json: detail(order)
    end

    # POST /api/orders
    def create
      order = Order.new(order_params)
      order.order_type        ||= "Digital - Email"
      order.status              = "complete"
      order.products_included ||= "Virtual Visa"
      order.payment_method_label = order.payment_method_label.presence || DEFAULT_PAYMENT
      order.placed_by_name      = PLACED_BY_NAME
      order.placed_by_email     = PLACED_BY_EMAIL

      if order.save
        render json: detail(order), status: :created
      else
        render json: { errors: order.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def order_params
      params.expect(
        order: [
          :campaign_name,
          :products_included,
          :payment_method_label,
          :external_id,
          :order_type,
          :currency,
          { recipients_attributes: [%i[name email amount_cents currency]] },
        ]
      )
    end

    # Row shape for the Order History table.
    def summary(order)
      {
        public_id: order.public_id,
        order_type: order.order_type,
        status: order.status,
        campaign_name: order.campaign_name,
        rewards_count: order.recipients.size,
        amount_cents: order.total_cents,
        amount: money(order.total_cents),
        currency: order.currency,
        external_id: order.external_id,
        created_on: order.created_at.strftime("%b %-d, %Y"),
        created_at: order.created_at.iso8601,
        created_by: order.placed_by_name,
      }
    end

    # Full detail for the order side-panel.
    def detail(order)
      summary(order).merge(
        products_included: order.products_included,
        payment_method_label: order.payment_method_label,
        placed_by_name: order.placed_by_name,
        placed_by_email: order.placed_by_email,
        subtotal_cents: order.subtotal_cents,
        subtotal: money(order.subtotal_cents),
        total: money(order.total_cents),
        recipients: order.recipients.map { |r| recipient(r) },
      )
    end

    def recipient(r)
      {
        id: r.id,
        name: r.name,
        email: r.email,
        amount_cents: r.amount_cents,
        amount: money(r.amount_cents),
        currency: r.currency,
      }
    end

    def money(cents)
      format("$%.2f", cents.to_i / 100.0)
    end
  end
end
