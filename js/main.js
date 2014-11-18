$(function()
{
  var requestData = {
    sql: "sql/product-questions.sql"
  };
  var currentSortInfo = {};
  var shoppingCart = [];

  function siteStartup()
  {
    $("span.top-column").click(setOrderAndDirection);
    $(".shopping-cart-button").click(shoppingCartButtonClick);
    $("i.sort-arrow").hide();

    requestData.run = "request all from table";
    requestData.table = "pcategories";
    contactDatabase(requestData, buildSortButtons);

    requestData.run = "request all from table";
    requestData.table = "products";
    contactDatabase(requestData, buildList);
  }

  function contactDatabase(request, successFunction)
  {
    $.ajax({
        url:"libs/sql-ajax-json.php",
        dataType: "json",
        data: request,
        success: successFunction
      });
  }

  function buildCurrentSortInfo(request)
  {
    // order by
    if (request.order == undefined)
    {
      currentSortInfo.order = "id";
    }
    else
    {
      currentSortInfo.order = request.order;
    }

    // direction
    if (request.direction == undefined)
    {
      currentSortInfo.direction = "ASC";
    }
    else
    {
      currentSortInfo.direction = request.direction;
    }

    // category
    if (request.category == undefined)
    {
      currentSortInfo.category = "all";
    }
    else
    {
      currentSortInfo.category = request.category;
    }

    emptyRequestData();
  }

  function emptyRequestData()
  {
    for (var key in requestData)
    {
      if (key != "sql")
      {
        requestData[key] = undefined;
      }
    }
  }

  function buildSortButtons(radioData)
  {
    var newRadioSection = $("<section>").addClass("category-radios");
    var newRadio = $("<input>")
      .addClass("radio-button cursor-pointer")
      .attr({
        id: "radio-category-all",
        type: "radio",
        name: "Categories",
        value: "all",
        checked: "true"})
      .click(onRadioClick);

    var newLabel = $("<label>")
      .addClass("radio-button cursor-pointer")
      .attr("for", "radio-category-all")
      .text("All");

    newRadioSection.append(newRadio);
    newRadioSection.append(newLabel);

    for (var i = 0; i < radioData.length; i++)
    {
      var anotherRadio = $("<input>")
      .addClass("radio-button cursor-pointer")
      .attr({
        id: "radio-category-"+ radioData[i].name,
        type: "radio",
        name: "Categories",
        value: radioData[i].name})
      .click(onRadioClick);

      var anotherLabel = $("<label>")
      .addClass("radio-button cursor-pointer")
      .attr("for", "radio-category-" + radioData[i].name)
      .text(radioData[i].name);

      newRadioSection.append(anotherRadio);
      newRadioSection.append(anotherLabel);
    }

    $(".settings-section").append(newRadioSection);
  }

  function getValueFromRadio()
  {
    var checkedRadio = $(".category-radios input[name=Categories]:checked");

    if(checkedRadio.val() == "all")
    {
      requestData.run = "request all from table";
      requestData.table = "products";
    }
    else
    {
      requestData.run = "request all products by category";
      requestData.category = checkedRadio.val();
    }
  }

  function onRadioClick()
  {
    getValueFromRadio();
    $(".sort-arrow").hide();
    contactDatabase(requestData, buildList);
  }

  function setOrderAndDirection()
  {
    var clickedColumn = $(this);
    var columnShowsArrows = clickedColumn.find(".sort-arrow:visible").length > 0;
    $(".sort-arrow").hide();

    if (currentSortInfo.direction == "DESC" || currentSortInfo.direction == undefined || columnShowsArrows != true)
    {
      clickedColumn.find(".ascending").show();
      requestData.direction = "ASC";
    }
    else
    {
      clickedColumn.find(".descending").show();
      requestData.direction = "DESC";
    }

    requestData.order = clickedColumn.attr("data-column-name");
    getValueFromRadio();
    requestData.run += "order by";

    contactDatabase(requestData, buildList);
  }

  function buildList(listData)
  {
    buildCurrentSortInfo(requestData);
    $('.product-listing article').not('.product-column-names').remove();

    for (var i = 0; i < listData.length; i++)
    {
      var newArticle = $("<article>");
      newArticle.data("productInfo", listData[i]);

      newArticle.append($("<span>").addClass("column-name").text(listData[i].name));
      newArticle.append($("<span>").addClass("column-price").text(listData[i].price));
      newArticle.append($("<span>").addClass("add-to-cart-button noselect").text("Add to Cart").click(addToCartButtonClick));
      // newArticle.append($("<div>").addClass("column-description").html(listData[i].description));
      $(".product-listing").append(newArticle);
    }
  }

  function addToCartButtonClick()
  {
    var selectedItem = $(this).parent();
    var productPosition = whereIsProductInCart(selectedItem.data("productInfo").id);
    // console.log("selectedItem: ", selectedItem);
    // console.log("productInfo: ", selectedItem.data("productInfo"));
    // console.log("shoppingCart before: ", shoppingCart);
    // console.log("shoppingCart[selectedItem.data('productInfo').id] == undefined: ", shoppingCart[selectedItem.data("productInfo").id] == undefined);
    console.log("productPositionInCart: ", productPosition);

    if (productPosition == -1)
    {
      var newProduct = selectedItem.data("productInfo");
      newProduct.amount = 1;
      shoppingCart.push(newProduct);
    }
    else
    {
      shoppingCart[productPosition].amount++;
    }
    console.log("shoppingCart after: ", shoppingCart);
  }

  function whereIsProductInCart(productId)
  {
    for (var i = 0; i < shoppingCart.length; i++)
    {
      if (shoppingCart[i].id == productId)
      {
        return i;
      }
    }
    return -1;
  }

  function updateShoppingCart()
  {

  }

  function shoppingCartButtonClick()
  {
    var shoppingCartDisplay = $(".shopping-cart");
    var clickedButton = $(this);
    shoppingCartDisplay.toggle();

    if (shoppingCartDisplay.css("display") == "none")
    {
      clickedButton.find("p").text("Show Shopping Cart");
      clickedButton.css("border-radius", "15px");
    }
    else
    {
      clickedButton.find("p").text("Hide Shopping Cart");
      clickedButton.css("border-radius", "15px 15px 0 0");
    }
  }

  siteStartup();
});