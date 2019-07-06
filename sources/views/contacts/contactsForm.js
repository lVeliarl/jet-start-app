import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";

export default class ContactsForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const placeholder = "http://diazworld.com/images/avatar-placeholder.png";

		return {
			rows: [
				{template: "Edit (add new) contact", localId: "formHeader", height: 100, borderless: true},
				{cols: [
					{
						view: "form",
						localId: "editContact",
						borderless: true,
						elementsConfig: {
							labelWidth: 150
						},
						rules: {
							FirstName: webix.rules.isNotEmpty,
							LastName: webix.rules.isNotEmpty,
							StartDate: webix.rules.isNotEmpty,
							birthDate: webix.rules.isNotEmpty
						},
						cols: [
							{rows: [
								{
									view: "text",
									label: _("First name"),
									name: "FirstName"
								},
								{
									view: "text",
									label: _("Last name"),
									name: "LastName"
								},
								{
									view: "datepicker",
									label: _("Joining date"),
									name: "StartDate",
									format: webix.i18n.longDateFormatStr,
									invalidMessage: _("Please select a date")
								},
								{
									view: "richselect",
									label: _("Status"),
									name: "StatusID",
									options: statuses
								},
								{
									view: "text",
									label: _("Job"),
									name: "Job"
								},
								{
									view: "text",
									label: _("Company"),
									name: "Company"
								},
								{
									view: "text",
									label: _("Website"),
									name: "Website"
								},
								{
									view: "text",
									label: _("Address"),
									name: "Address",
									height: 100
								},
								{}
							],
							margin: 20
							},
							{rows: [
								{
									view: "text",
									label: _("Email"),
									name: "Email"
								},
								{
									view: "text",
									label: _("Skype"),
									name: "Skype"
								},
								{
									view: "text",
									label: _("Phone"),
									name: "Phone"
								},
								{
									view: "datepicker",
									label: _("Birthday"),
									name: "birthDate",
									format: webix.i18n.longDateFormatStr,
									invalidMessage: _("Please select a date")
								},
								{
									cols: [
										{
											template: obj => `<img src=${obj || placeholder} width=230 height=230></img>`,
											localId: "photoPreview",
											name: "Photo",
											width: 250,
											height: 250,
											borderless: true
										},
										{
											rows: [
												{},
												{
													view: "uploader",
													value: _("Change photo"),
													accept: "image/jpeg, image/png",
													multiple: "false",
													on: {
														onBeforeFileAdd: (img) => {
															let reader = new FileReader();
															reader.onload = (event) => {
																this.$$("photoPreview").setValues(event.target.result);
															};
															reader.readAsDataURL(img.file);
															return false;
														}
													}
												},
												{
													view: "button",
													value: _("Delete photo"),
													click: () => {
														let item = contacts.getItem(this.getParam("id"));
														this.$$("photoPreview").setValues(placeholder);
														item.Photo = "";
													}
												}
											],
											margin: 10
										}
									]
								},
								{}
							],
							margin: 20
							}
						]
					}
				]
				},
				{cols: [
					{},
					{
						view: "button",
						value: _("Cancel"),
						click: () => {
							let form = this.$$("editContact");
							let value = this.$$("saveContact").getValue();
							if (value === "Add") {
								contacts.remove(contacts.getLastId());
							}
							webix.$$("top:contactsInfo").show(false, false);
							form.clear();
							form.clearValidation();
						}
					},
					{
						view: "button",
						value: "Save(add)",
						localId: "saveContact",
						css: "webix_primary",
						click: () => {
							let id = this.getParam("id");
							let form = this.$$("editContact");
							let value = form.getValues();
							if (form.validate()) {
								value.Photo = this.$$("photoPreview").getValues();
								if (contacts.exists(id)) {
									contacts.updateItem(id, value);
								}
								webix.message("Entry successfully saved");
								webix.$$("top:contactsInfo").show(false, false);
								form.clear();
								form.clearValidation();
							}
						}
					}
				]}
			]
		};
	}

	init() {
		const _ = this.app.getService("locale")._;

		let updateButton = this.$$("saveContact");
		let formHeader = this.$$("formHeader");

		this.on(this.app, "addContact", (item, mode) => {
			formHeader.setHTML(_(`<h2>${mode} new contact</h2>`));
			updateButton.setValue(_(`${mode}`));
			this.$$("editContact").setValues({FirstName: "John", LastName: "Doe", StatusID: 1});
		});

		this.on(this.app, "editContact", (item, mode) => {
			formHeader.setHTML(_(`<h2>${mode} contact</h2>`));
			updateButton.setValue(_("Save"));
			this.$$("editContact").setValues(item);
		});
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			let id = this.getParam("id");
			let item = contacts.getItem(id);
			const placeholder = "http://diazworld.com/images/avatar-placeholder.png";
			this.$$("photoPreview").setValues(placeholder);
			this.$$("editContact").setValues(item);
		});
	}
}
