class ApplicationController < ActionController::API
  # Turn common ActiveRecord errors into clean JSON responses instead of 500s.
  rescue_from ActiveRecord::RecordNotFound do |e|
    render json: { error: e.message }, status: :not_found
  end

  rescue_from ActiveRecord::RecordInvalid do |e|
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end
end
