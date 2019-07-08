import {activities} from "./activities";

const formatToDate = webix.Date.strToDate("%d-%m-%Y");
const serverFormat = webix.Date.dateToStr("%Y-%m-%d %H:%i");

export const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$change: (obj) => {
			obj.value = `${obj.FirstName} ${obj.LastName}`;
			obj.StartDate = formatToDate(obj.StartDate);
			obj.Birthday = formatToDate(obj.Birthday);
		},
		$save: (obj) => {
			obj.StartDate = serverFormat(obj.StartDate);
			obj.Birthday = serverFormat(obj.Birthday);
		}
	}
});

contacts.attachEvent("onAfterDelete", (id) => {
	let contactActivities = activities.find(
		obj => obj.ContactID.toString() === id.toString()
	);
	contactActivities.forEach((obj) => {
		activities.remove(obj.id);
	});
});
