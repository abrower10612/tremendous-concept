module Api
  class ContactsController < ApplicationController
    before_action :set_contact, only: %i[update destroy]

    # GET /api/contacts
    def index
      render json: Contact.alphabetical.map { |c| serialize(c) }
    end

    # POST /api/contacts
    def create
      contact = Contact.new(contact_params)
      if contact.save
        render json: serialize(contact), status: :created
      else
        render json: { errors: contact.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /api/contacts/:id
    def update
      if @contact.update(contact_params)
        render json: serialize(@contact)
      else
        render json: { errors: @contact.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # DELETE /api/contacts/:id
    def destroy
      @contact.destroy
      head :no_content
    end

    private

    def set_contact
      @contact = Contact.find(params[:id])
    end

    # Rails 8 strong params: only these keys are allowed in from the client.
    def contact_params
      params.expect(contact: %i[name email phone])
    end

    def serialize(contact)
      {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
      }
    end
  end
end
