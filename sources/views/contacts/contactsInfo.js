import {JetView} from "webix-jet";
import ActivitiesTable from "./activitiesTable";
import FilesTable from "./filesTable";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";
import {placeholder} from "../../helpers/placeholder";

export default class ContactInfo extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const format = webix.Date.dateToStr("%d-%m-%Y");

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
										<span class='mdi mdi-calendar-month'>${format(obj.Birthday) || "-"}</span>
										<span class='mdi mdi-map-marker'>${obj.Address || "-"}</span>
									</div>
								</div>
							</div>`,
							localId: "contactsInfo",
							borderless: true,
							format: webix.i18n.dateFormatStr
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
										this.app.callEvent("editContact", ["Save"]);
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
											text: _("Do you really want to remove this contact?"),
											ok: _("OK"),
											cancel: _("Cancel")
										}).then(() => {
											contacts.remove(id);
											this.show("contacts");
										});
									}
								},
								{}
							]
						}
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
			let contactsInfo = this.$$("contactsInfo");

			if (contacts.exists(id)) {
				let selectedContact = webix.copy(contacts.getItem(id));
				let selectedStatusID = statuses.getItem(selectedContact.StatusID);

				selectedContact.Status = selectedStatusID.Value;
				contactsInfo.setValues(selectedContact);
			}
			else if (!contacts.exists(contacts.getFirstId())) {
				contactsInfo.setValues({});
			}
		});
	}
}
