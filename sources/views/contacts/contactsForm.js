import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";
import {placeholder} from "../../helpers/placeholder";

export default class ContactsForm extends JetView {
	config() {
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
							Birthday: webix.rules.isNotEmpty
						},
						cols: [
							{rows: [
								{
									view: "text",
									label: "First name",
									name: "FirstName"
								},
								{
									view: "text",
									label: "Last name",
									name: "LastName"
								},
								{
									view: "datepicker",
									label: "Joining date",
									name: "StartDate",
									format: webix.i18n.longDateFormatStr,
									invalidMessage: "Please select a date"
								},
								{
									view: "richselect",
									label: "Status",
									name: "StatusID",
									options: statuses
								},
								{
									view: "text",
									label: "Job",
									name: "Job"
								},
								{
									view: "text",
									label: "Company",
									name: "Company"
								},
								{
									view: "text",
									label: "Website",
									name: "Website"
								},
								{
									view: "text",
									label: "Address",
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
									label: "Email",
									name: "Email"
								},
								{
									view: "text",
									label: "Skype",
									name: "Skype"
								},
								{
									view: "text",
									label: "Phone",
									name: "Phone"
								},
								{
									view: "datepicker",
									label: "Birthday",
									name: "Birthday",
									format: webix.i18n.longDateFormatStr,
									invalidMessage: "Please select a date"
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
													value: "Change photo",
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
													value: "Delete photo",
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
						value: "Cancel",
						click: () => {
							this.app.callEvent("editCancel");
							this.clearForm();
						}
					},
					{
						view: "button",
						value: "Save(add)",
						localId: "saveContact",
						css: "webix_primary",
						click: () => {
							let form = this.$$("editContact");
							let value = form.getValues();
							if (form.validate()) {
								value.Photo = this.$$("photoPreview").getValues();
								if (contacts.exists(value.id)) {
									contacts.updateItem(value.id, value);
								}
								else {
									contacts.waitSave(() => {
										contacts.add(value);
									}).then((res) => {
										this.getParentView().setParam("id", res.id, true);
									});
								}
								this.app.callEvent("editCancel");
								webix.message("Entry successfully saved");
								this.clearForm();
							}
						}
					}
				]}
			]
		};
	}

	init() {
		let updateButton = this.$$("saveContact");
		let formHeader = this.$$("formHeader");

		this.on(this.app, "editContact", (mode) => {
			let item = contacts.getItem(this.getParam("id"));
			if (mode === "Save") {
				formHeader.setHTML("<h2>Edit contact</h2>");
				this.$$("editContact").setValues(item);
			}
			if (mode === "Add") {
				this.show("contacts");
				formHeader.setHTML("<h2>Add new contact</h2>");
				this.$$("editContact").setValues({FirstName: "John", LastName: "Doe", StatusID: 1});
			}
			updateButton.setValue(mode);
		});
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			let id = this.getParam("id");
			let item = contacts.getItem(id);

			if (item.Photo === "") {
				this.$$("photoPreview").setValues(placeholder);
			}
			else {
				this.$$("photoPreview").setValues(item.Photo);
			}
			this.$$("editContact").setValues(item);
		});
	}

	clearForm() {
		let form = this.$$("editContact");
		form.clear();
		form.clearValidation();
	}
}
