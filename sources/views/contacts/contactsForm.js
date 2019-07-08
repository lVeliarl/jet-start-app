import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {statuses} from "../../models/statuses";
import {placeholder} from "../../helpers/placeholder";

export default class ContactsForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{
					template: "Edit (add new) contact",
					localId: "formHeader",
					height: 100,
					borderless: true,
					css: "form_header"
				},
				{
					cols: [
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
							margin: 75,
							cols: [
								{
									rows: [
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
								{
									rows: [
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
											name: "Birthday",
											format: webix.i18n.longDateFormatStr,
											invalidMessage: _("Please select a date")
										},
										{
											padding: 20,
											cols: [
												{
													template: obj => `<img src=${obj}></img>`,
													localId: "photoPreview",
													name: "Photo",
													borderless: true,
													css: "photo_preview"
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
				{
					padding: 30,
					cols: [
						{},
						{
							view: "button",
							value: _("Cancel"),
							width: 200,
							click: () => {
								this.app.callEvent("editCancel");
								this.clearForm();
							}
						},
						{
							view: "button",
							value: "Save(add)",
							width: 200,
							localId: "saveContact",
							css: "webix_primary",
							click: () => {
								let id = this.getParam("id");
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
					]
				}
			]
		};
	}


	urlChange() {
		webix.promise.all([
			contacts.waitData,
			statuses.waitData
		]).then(() => {
			let id = this.getParam("id");
			let item = contacts.getItem(id);
			let updateButton = this.$$("saveContact");
			let formHeader = this.$$("formHeader");
			const _ = this.app.getService("locale")._;

			if (id) {
				formHeader.setHTML(_("<h2>Edit contact</h2>"));
				this.$$("editContact").setValues(item);
				updateButton.setValue(_("Save"));
			}
			else {
				formHeader.setHTML(_("<h2>Add new contact</h2>"));
				this.$$("editContact").setValues({FirstName: "John", LastName: "Doe", StatusID: 1});
				updateButton.setValue(_("Add"));
			}

			if (!item || item.Photo === "") {
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
