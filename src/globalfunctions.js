export function computeTranslatedText(inText, inLocale) {
  if (inText == undefined) return "";
  if (!(inText.startsWith("@") && inText.endsWith("@"))) return inText;
  var res = inText.substring(1, inText.length - 1).split(";");

  var resht = {};
  res.forEach(x => {
    var rec = x.split("=");
    if (rec.length > 0) {
      resht[rec[0]] = rec[1];
    }
  });
  if (resht[inLocale] != undefined) return resht[inLocale];
  return res;
}

import Vue from "vue";
import moment from "moment";

// a retirer
Vue.filter("formatDate", function(value) {
  if (value) {
    return moment(String(value)).format("DD/MM");
  }
});

Vue.filter("dateShort", function(value) {
  if (value) {
    return moment(String(value)).format("DD/MM");
  }
});

Vue.filter("dateFrench", function(value) {
  if (value) {
    moment.locale("fr");
    return moment(String(value)).format("DD MMMM YYYY");
  }
});

Vue.filter("uppercaseFirst", function(value) {
  if (value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
});
