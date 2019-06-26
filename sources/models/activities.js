export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/ ",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (obj) => {
			let formatToDate = webix.Date.strToDate("%d-%m-%Y %H:%i");
			if (!obj.convertedDate) {
				obj.convertedDate = new Date(formatToDate(obj.DueDate));
			}
			if (!obj.convertedTime) {
				obj.convertedTime = new Date(obj.convertedDate);
			}
		},
		$save: (obj) => {
			let formatToStr = webix.Date.dateToStr("%Y-%m-%d %H:%i");
			obj.DueDate = new Date(obj.convertedDate);
			obj.DueTime = new Date(obj.convertedTime);
			obj.DueDate.setHours(obj.DueTime.getHours());
			obj.DueDate.setMinutes(obj.DueTime.getMinutes());
			obj.DueDate = formatToStr(obj.DueDate);
		}
	}
});
