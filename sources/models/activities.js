export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/ ",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init: (obj) => {
			if (typeof obj.DueDate === "string") {
				let convertToDate = new Date(obj.DueDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
				let day = convertToDate.getDate();
				let month = convertToDate.toLocaleString("en-us", {month: "long"});
				let year = convertToDate.getFullYear();
				obj.DueDate = `${day} ${month} ${year}`;
			}
		}
		// $save: (obj) => {

		// }
	}
});
