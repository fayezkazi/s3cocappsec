sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    'sap/m/MessageBox'
],
function (Controller, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("coc.demo.s3cocapp.controller.Main", {
        onInit: function () {
            this.oBusyDialog = new sap.m.BusyDialog();
        },
        handleUploadComplete: function (oEvent) {
            oEvent.getSource().removeAllHeaderParameters();
            var sResponse = oEvent.getParameter("response");
            if ($.isEmptyObject(sResponse)) {
                MessageBox.error(oEvent.getParameter('responseRaw'));
                this.oBusyDialog.close();
                return;
            }
            // var iHttpStatusCode = oEvent.getParameter('status');

            if (sResponse) {
                // if (iHttpStatusCode === 201) {
                if (sResponse === "200") {
                    MessageToast.show('File uploaded successfully.');
                } else {
                    MessageBox.error({
                        title: 'Error uploading file.',
                        // details: sResponse
                        details: 'File upload Failed'
                    });
                }
            }
            this.oBusyDialog.close();
        },
        handleUploadPress: function () {
            var oFileUploader = this.byId("fileUploader");
            // oFileUploader.upload(); //Added
            var oModel = this.getOwnerComponent().getModel();

            this.oBusyDialog.open();
            oFileUploader.checkFileReadable().then(function () {
                // oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
                //     name: 'slug',
                //     value: oFileUploader.getProperty('value')
                // }));
                // oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
                //     name: 'x-csrf-token',
                //     value: oModel.getSecurityToken()
                // }));
                oFileUploader.upload();
            }, function (error) {
                MessageToast.show("The file cannot be read. It may have changed.");
            }).then(function () {
                oFileUploader.clear();
            });
        }        
    });
});
