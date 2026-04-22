require 'test_helper'

class GamesControllerTest < ActionController::TestCase
  test 'should get index' do
    get :index
    assert_response :success
    assert_select 'h1', 'Dot Dash'
  end
end
