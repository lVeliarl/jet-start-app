import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";
import {fileStorage} from "../../models/fileStorage";

export default class FilesTable extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{
					view: "datatable",
					localId: "files",
					scroll: "auto",
					css: "table_outline",
					select: true,
					borderless: true,
					columns: [
						{id: "name", header: _("Name"), template: "", fillspace: true, sort: "string"},
						{id: "date", header: _("Change date"), template: "", width: 150, sort: "date", format: webix.i18n.longDateFormatStr},
						{
							id: "size",
							header: _("Size"),
							template: obj => `${obj.size}Kb`,
							sort: "int"
						},
						{id: "deleteFile", header: "", width: 50, template: "<span class='mdi mdi-trash-can delete_file'></span>"}
					],
					onClick: {
						delete_file: (e, id) => {
							webix.confirm({
								title: _("Delete this file"),
								text: _("Are you sure you want to delete this file?"),
								ok: _("OK"),
								cancel: _("Cancel")
							}).then(() => {
								this.$$("files").remove(id);
							});
							return false;
						}
					}
				},
				{
					css: "files_line",
					cols: [
						{},
						{
							view: "uploader",
							localId: "uploadFiles",
							type: "icon",
							icon: "mdi mdi-cloud-upload",
							label: _("Upload file"),
							css: "webix_primary"
						},
						{}
					]
				}
			]
		};
	}

	init() {
		this.$$("files").sync(fileStorage);

		let id = this.getParam("id");

		this.$$("uploadFiles").attachEvent("onBeforeFileAdd", (obj) => {
			let item = {
				name: obj.name,
				size: obj.size,
				date: obj.file.lastModifiedDate,
				ContactID: id
			};
			fileStorage.add(item);
			return false;
		});
	}

	urlChange() {
		contacts.waitData.then(() => {
			let id = this.getParam("id");

			fileStorage.filter(obj => obj.ContactID.toString() === id.toString());
		});
	}
}
