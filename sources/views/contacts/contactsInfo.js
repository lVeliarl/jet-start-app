import {JetView} from "webix-jet";
import ActivitiesTable from "./activitiesTable";
import FilesTable from "./filesTable";
import {activities} from "../../models/activities";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";

export default class ContactInfo extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const placeholder = "http://diazworld.com/images/avatar-placeholder.png";

		return {
			rows: [
				{
					cols: [
						{
							template: obj => `<div class='wrapper info'>
								<div class='row row1'>
									<div class='column column1'>
										<h2 class='contacts_name'>${obj.FirstName || "-"} ${obj.LastName || "-"} </h2>
									</div>
								</div>
								<div class='row row2'>
									<div class='column column1'>
										<img src=${obj.Photo || placeholder} width=200 height=200></span>
										<h4 class='label'>${obj.Status || "-"}</h4>
									</div>
									<div class='column column2'>
										<span class='mdi mdi-email'>${obj.Email || "-"}</span>
										<span class='mdi mdi-skype'>${obj.Skype || "-"}</span>
										<span class='mdi mdi-tag'>${obj.Job || "-"}</span>
										<span class='mdi mdi-briefcase'>${obj.Company || "-"}</span>
									</div>
									<div class='column column3'>
										<span class='mdi mdi-calendar-month'>${obj.Birthday || "-"}</span>
										<span class='mdi mdi-map-marker'>${obj.Address || "-"}</span>
									</div>
								</div>
							</div>`,
							localId: "contactsInfo",
							borderless: true
						},
						{
							padding: 20,
							rows: [
								{
									view: "button",
									label: _("Edit"),
									css: "webix_primary",
									width: 250,
									type: "icon",
									icon: "mdi mdi-file-document-edit",
									click: () => {
										let id = this.getParam("id");
										let item = contacts.getItem(id);
										this.app.callEvent("editContact", [item, "Edit"]);
										webix.$$("top:contactsForm").show(false, false);
									}
								},
								{
									view: "button",
									label: _("Delete"),
									css: "webix_primary",
									type: "icon",
									width: 250,
									icon: "mdi mdi-trash-can",
									click: () => {
										let id = this.getParam("id");
										this.webix.confirm({
											title: _("Delete this contact"),
											text: _("Do you really want to remove this contatct?"),
											ok: _("OK"),
											cancel: _("Cancel")
										}).then(() => {
											contacts.remove(id);
											let contactActivities = activities.find(
												obj => obj.ContactID.toString() === id.toString()
											);
											contactActivities.forEach((obj) => {
												activities.remove(obj.id);
											});
										});
									}
								},
								{}
							]}
					]
				},
				{
					view: "segmented",
					multiview: true,
					options: [
						{id: "activitiesSwitch", value: _("Activities")},
						{id: "filesSwitch", value: _("Files")}
					]
				},
				{
					cells: [
						{$subview: ActivitiesTable, id: "activitiesSwitch"},
						{$subview: FilesTable, id: "filesSwitch"}
					]
				}
			]
		};
	}

	init() {
		contacts.attachEvent("onDataUpdate", () => {
			this.$$("contactsInfo").setValues(contacts.getItem(this.getParam("id")));
		});
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			let id = this.getParam("id");
			let selectedContact = webix.copy(contacts.getItem(id));
			let selectedStatusID = statuses.getItem(selectedContact.StatusID);
			let contactsInfo = this.$$("contactsInfo");

			selectedContact.Status = selectedStatusID.Value;
			contactsInfo.setValues(selectedContact);
		});
	}
}
