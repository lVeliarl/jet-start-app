export const iconOptions = new webix.DataCollection({
	scheme: {
		$init: (obj) => {
			obj.value = `<span class="webix_icon mdi mdi-${obj.Value}"></span>`;
		}
	},
	data: [
		{id: "sync", Value: "sync"},
		{id: "alert", Value: "alert"},
		{id: "clock", Value: "clock"},
		{id: "close", Value: "close"},
		{id: "flag", Value: "flag"},
		{id: "comment", Value: "comment"},
		{id: "phone", Value: "phone"},
		{id: "pause-circle", Value: "pause-circle"},
		{id: "food", Value: "food"},
		{id: "checkbox-marked", Value: "checkbox-marked"},
		{id: "file-document-box-multiple", Value: "file-document-box-multiple"}
	]
});
