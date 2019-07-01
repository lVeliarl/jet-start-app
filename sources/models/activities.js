const formatToDate = webix.Date.strToDate("%d-%m-%Y %H:%i");
const formatToStr = webix.Date.dateToStr("%Y-%m-%d %H:%i");

export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/ ",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (obj) => {
			if (!obj.convertedDate) {
				obj.convertedDate = formatToDate(obj.DueDate);
			}
			if (!obj.convertedTime) {
				obj.convertedTime = obj.convertedDate;
			}
		},
		$save: (obj) => {
			let time = obj.convertedTime;
			let date = obj.convertedDate;
			date.setHours(time.getHours());
			date.setMinutes(time.getMinutes());
			obj.DueDate = formatToStr(date);
		}
	}
});
