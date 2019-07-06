const formatToDate = webix.Date.strToDate("%d-%m-%Y %H:%i");
const formatToStr = webix.Date.dateToStr("%Y-%m-%d %H:%i");

export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/ ",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$change: (obj) => {
			obj.DueDate = formatToDate(obj.DueDate);
			obj.DueTime = formatToDate(obj.DueDate);
		},
		$save: (obj) => {
			obj.DueDate = formatToStr(obj.DueDate);
		}
	}
});
