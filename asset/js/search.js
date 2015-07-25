(function(window, document, undefined) {

  // Retrieves the value of a GET parameter with a given key
  // Accepts:
  //   param: string
  // Returns:
  //   string or null
  var getTag = function() {
    var queryString = window.location.search.substring(1),
        queries = queryString.split('&');
    
    if (queryString == "")
      return null;
    else
      return queryString.replace(/tag=/, "");
  };

  window.hobbit = {
    getTag : getTag
  }
})(window, window.document);

var makeTagCloud = function(dictionary) {
  var tag_dictionary = {};
  var tag_list = [];

  var i = 0;
  var i_length = dictionary.length;

  if (i_length == 0)
    return;

  for (i ; i < i_length ; ++i) {

    if (dictionary[i] == null)
      continue;

    var tags = dictionary[i]["tags"];
    var j = 0;
    var j_length = tags.length;
    var current_tag = null;

    for (j ; j < j_length ; ++j) {
      current_tag = tags[j];

      if (current_tag == null)
        continue;

      if (tag_dictionary[current_tag] == null) {
        tag_dictionary[current_tag] = 1;
        tag_list.push(current_tag);
      } else {
        tag_dictionary[current_tag] += 1;
      }
    }
  }

  var k = 0;
  var k_length = tag_list.length;
  var tag_string = "";
  for (k ; k < k_length ; ++k) {
    var tag_template = $("#template_tag").text();
    var current_tag_name = tag_list[k];
    tag_template = tag_template.replace(/\$tag_name\$/g, current_tag_name);
    tag_template = tag_template.replace(/\$tag_count\$/g, tag_dictionary[current_tag_name]);

    tag_string += tag_template;
  }

  $(".tags").html(tag_string);
}

var getTagTemplateString = function(tags) {
  var tagString = "";
  var i = 0;
  var length = tags.length;

  for (i ; i < length ; ++i) {
    if (tags[i] == null)
      continue;
    var tag_template = $("#template_tag_simple").text();
    tagString += tag_template.replace(/\$tag_name\$/g, tags[i]);
  }

  return tagString;
}

var getTagTemplateStringByTagName = function(tagName, tags) {
  var tagString = "";
  var i = 0;
  var length = tags.length;

  var isTagExist = false;
  for (i ; i < length ; ++i) {
    if (tags[i] == null)
      continue;

    if (tags[i] == tagName)
      isTagExist = true;

    var tag_template = $("#template_tag_simple").text();
    tagString += tag_template.replace(/\$tag_name\$/g, tags[i]);
  }

  if (isTagExist)
    return tagString;
  else
    return "";
}

var getTemplateString = function(element) {

  if (element == null)
    return "";

  var template = $('#template').text();
  
  template = template.replace(/\$author\$/g, element["author"]);
  template = template.replace(/\$url\$/g, element["url"]);
  template = template.replace(/\$title\$/g, element["title"]);
  template = template.replace(/\$description\$/g, element["description"]);
  template = template.replace(/\$year\$/g, element["date"]["year"]);
  template = template.replace(/\$month\$/g, element["date"]["month"]);
  template = template.replace(/\$day\$/g, element["date"]["day"]);

  var tagString = getTagTemplateString(element["tags"]);
  template = template.replace(/\$tag_location\$/g, tagString);

  return template;
};

var getTemplateStringByTagName = function(tagName, element) {

  if (element == null)
    return "";

var tagString = getTagTemplateStringByTagName(tagName, element["tags"]);
  if (tagString == "")
    return "";

  var template = $('#template').text();
  
  template = template.replace(/\$author\$/g, element["author"]);
  template = template.replace(/\$url\$/g, element["url"]);
  template = template.replace(/\$title\$/g, element["title"]);
  template = template.replace(/\$description\$/g, element["description"]);
  template = template.replace(/\$year\$/g, element["date"]["year"]);
  template = template.replace(/\$month\$/g, element["date"]["month"]);
  template = template.replace(/\$day\$/g, element["date"]["day"]);
  template = template.replace(/\$tag_location\$/g, tagString);

  return template;
};

$(function() {

  $.getJSON('/search.json', function(data) {

    makeTagCloud(data);

    var tag = hobbit.getTag();
    var addedHTML = "";
    
    if (tag == null) {
      var i = 0 ;
      var length = data.length;
      for (i ; i < length ; ++i) {
        addedHTML += getTemplateString(data[i]);
      }
          
    } else {
      var i = 0 ;
      var length = data.length;
      for (i ; i < length ; ++i) {
        addedHTML += getTemplateStringByTagName(tag, data[i]);
      }

    }

    $(".posts ul").html(addedHTML);
  });
});