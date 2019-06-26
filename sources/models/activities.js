export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/ ",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (obj) => {
			// console.log(obj.DueDate);
			// let format = webix.Date.strToDate("%d - %m - %Y %H:%i");
			// console.log(format("04 - 12 - 2012 20:12"));
			if (typeof obj.DueDate === "string") {
				let convertToDate = new Date(obj.DueDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
				let day = convertToDate.getDate();
				let month = convertToDate.toLocaleString("en-us", {month: "long"});
				let year = convertToDate.getFullYear();
				obj.DueDate = `${day} ${month} ${year}`;
			}
		},
		$save: (obj) => {
			let test = obj.DueDate;
			let format = webix.Date.dateToStr("%Y - %m - %d %H:%i");
			obj.test = format(test);
		}
	}
});
