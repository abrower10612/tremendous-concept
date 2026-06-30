Rails.application.routes.draw do
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    # Contacts: the new feature. Full CRUD.
    resources :contacts, only: %i[index create update destroy]

    # Orders: list + detail + place a new order. Looked up by public_id.
    resources :orders, only: %i[index show create], param: :public_id
  end
end
