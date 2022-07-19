/*
Copyright 2019 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it. If you have received this file from a source other than Adobe,
then your use, modification, or distribution of it requires the prior
written permission of Adobe.
*/

/* Pass the embed mode option here */
var viewerConfig = {
  embedMode: "SIZED_CONTAINER",
};

/* Wait for Adobe Document Services PDF Embed API to be ready */
document.addEventListener("adobe_dc_view_sdk.ready", function () {
  /* Initialize the AdobeDC View object */
  var adobeDCView = new AdobeDC.View({
    /* Pass your registered client id */
    clientId:
      window.location.hostname === "localhost"
        ? "e8ef502c44894da0a37b5d57c045398f"
        : "f54ff22a5c1a418c8b0d74e894f9f0fd",
    /* Pass the div id in which PDF should be rendered */
    divId: "adobe-dc-view",
  });

  /* Invoke the file preview API on Adobe DC View object */
  adobeDCView.previewFile(
    {
      /* Pass information on how to access the file */
      content: {
        /* Location of file where it is hosted */
        location: {
          url: "https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea Brochure.pdf",
          /*
                If the file URL requires some additional headers, then it can be passed as follows:-
                header: [
                    {
                        key: "<HEADER_KEY>",
                        value: "<HEADER_VALUE>",
                    }
                ]
                */
        },
      },
      /* Pass meta data of file */
      metaData: {
        /* file name */
        fileName: "Bodea Brochure.pdf",
      },
    },
    viewerConfig
  );
});
