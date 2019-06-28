export const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init: (obj) => {
			obj.Placeholder = "http://diazworld.com/images/avatar-placeholder.png";
			obj.value = `${obj.FirstName} ${obj.LastName}`;
		}
	}
});
