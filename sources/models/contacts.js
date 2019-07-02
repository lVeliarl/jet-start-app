const formatToDate = webix.Date.strToDate("%d-%m-%Y %H:%i");
const formatToStr = webix.Date.dateToStr("%Y-%m-%d %H:%i");

export const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: (obj) => {
			obj.value = `${obj.FirstName} ${obj.LastName}`;
			obj.StartDate = formatToDate(obj.StartDate);
			if (!obj.birthDate) {
				obj.birthDate = formatToDate(obj.Birthday);
			}
		},
		$save: (obj) => {
			obj.StartDate = formatToStr(obj.StartDate);
			obj.Birthday = formatToStr(obj.birthDate);
		}
	}
});
