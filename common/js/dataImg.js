const app = getApp()

const addSrc = function (src){
  let domainL = app.Interfaces.domainL;
  if(src.indexOf("http") === -1 && src.indexOf("https") === -1) {
    if (src.indexOf("media") > -1) {
      src = domainL + src;
    } else {
      src = domainL + "/media/" + src;
    }
  }
  return src
}

export default {
  addSrc
}