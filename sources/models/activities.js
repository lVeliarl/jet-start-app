export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/ ",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (obj) => {
			let convertToDate = new Date(obj.DueDate);
			console.log(convertToDate, obj.DueDate);
			let format = webix.Date.dateToStr("%d %m %y");
			obj.DueDate = format(convertToDate);
		}
	}
});
