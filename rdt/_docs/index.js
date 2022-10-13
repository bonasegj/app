(async function () {
  const uri = window.location.toString().replace("#", "");
  console.log(uri);
  return await fetch(uri);
})();
