# Serves the built React app's index.html for any non-API path, so client-side
# routes (e.g. /history/orders, /contacts) work on a hard refresh / deep link.
# Static assets themselves are served by ActionDispatch::Static before routing.
class SpaController < ActionController::Base
  def index
    index_path = Rails.public_path.join("index.html")
    if index_path.exist?
      send_file index_path, type: "text/html", disposition: "inline"
    else
      render plain: "Frontend build not found. Run the frontend build first.",
             status: :not_found
    end
  end
end
