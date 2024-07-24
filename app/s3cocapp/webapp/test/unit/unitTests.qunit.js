/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"cocdemo/s3cocapp/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
