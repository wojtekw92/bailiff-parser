'use strict';
var http = require('http');
var cheerio = require('cheerio');

var returnHtml = function (callback, cb) {
  return function(resp) {
    var str='';
    resp.on('data', function (chunk) { str += chunk; });
    resp.on('end', function () { callback(str, cb); });
  }
}

var parsePage = function(data, cb) {
  var jsonData = [];
  var $ = cheerio.load(data);
  $('table.wMax').children('tr').each(function(index, element){
    var tmpObj = {};
    if(index === 0) return;
    var row = $(this).children();
    tmpObj.img = row.eq(1).children().first().children().attr('src');
    tmpObj.date = row.eq(2).text().replace(/^\s+|\s+$/g, "");
    tmpObj.name = row.eq(3).children('div').text().replace(/^\s+|\s+$/g, "");
    if (row.eq(3).children('div').hasClass('item-desc-text-max')) {
      row.eq(3).children('div.item-desc-text-max').children('span').remove();
      tmpObj.name = row.eq(3).children('div.item-desc-text-max').text().replace(/^\s+|\s+$/g, "")
    }
    tmpObj.city = $("<span>"+row.eq(4).html().split("<br>")[0].replace(/^\s+|\s+$/g, "")+"</span>").text();
    tmpObj.dist = $("<span>"+row.eq(4).html().split("<br>")[1].replace(/^\s*\(|\)\s*$/g, "")+"</span>").text();
    tmpObj.price = $("<span>"+row.eq(5).html().split("<br>")[0].replace(/^\s+|\s+$/g, "")+"</span>").text();
    tmpObj.offerId = row.eq(7).children('a').attr("href").split("/")[3];
    jsonData.push(tmpObj);
  });
  cb(jsonData);
}

var getPageCountInternal = function(data, cb) {
  var $ = cheerio.load(data);
  var elem = $('a').filter(function(){ return $(this).html() === '&gt;&gt;';});
  if (elem.attr('href').split("=").length === 2) {
    cb(elem.attr('href').split("=")[1]);
  }
}

var getCategoriesInternal = function(data, cb) {
  var categories = [];
  var $ = cheerio.load(data);
  $('[href*="/Notice/Filter/"]').each(function(index, element){
    categories.push({
      name: $(this).text(),
      id: $(this).attr('href').split('/').pop(),
    });
  });
  cb(categories);
}

//Public API
exports.getCategories = function(callback) {
  http.request({
              host: 'licytacje.komornik.pl',
              path: '/',
            }, returnHtml(getCategoriesInternal, callback)).end();
}

exports.getPageCount = function(category, callback) {
  http.request({
              host: 'licytacje.komornik.pl',
              path: '/Notice/Filter/'+category,
            }, returnHtml(getPageCountInternal, callback)).end();
}
exports.getOffers = function(category, page, callback) {
  http.request({
              host: 'licytacje.komornik.pl',
              path: '/Notice/Filter/' + category + '?page=' + page,
            }, returnHtml(parsePage, callback)).end();
}

exports.getCategoriesAsync = function() {
    return new Promise((resolve, reject) => {
      exports.getCategories(resolve);
    });
};

exports.getPageCountAsync = function(category) {
  return new Promise((resolve, reject) => {
    exports.getPageCount(category, resolve);
  });
}

exports.getOffersAsync = function(category, page) {
  return new Promise((resolve, reject) => {
    exports.getOffers(category, page, resolve);
  });
}