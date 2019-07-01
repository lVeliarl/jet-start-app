import {JetView} from "webix-jet";
import {contacts} from "../../models/contacts";

export default class FilesTable extends JetView {
	config() {
		return {
			rows: [
				{
					view: "datatable",
					localId: "files",
					scroll: "auto",
					select: true,
					columns: [
						{id: "name", header: "Name", template: "", fillspace: true, sort: "string"},
						{id: "changeDate", header: "Change date", template: "", width: 150, sort: "date", format: webix.i18n.longDateFormatStr},
						{id: "sizetext", header: "Size", template: "", sort: "string"},
						{id: "deleteFile", header: "", width: 50, template: "<span class='mdi mdi-trash-can'></span>", css: "delete_file"}
					],
					onClick: {
						delete_file: (e, id) => {
							webix.confirm({
								title: "Delete this file",
								text: "Are you sure you want to delete this file?"
							}).then(() => {
								this.$$("files").remove(id);
							});
							return false;
						}
					}
				},
				{
					cols: [
						{},
						{
							view: "uploader",
							localId: "uploadFiles",
							type: "icon",
							icon: "mdi mdi-cloud-upload",
							label: "Upload file",
							css: "webix_primary",
							link: "files",
							upload: "../../models/fileStorage"
						},
						{}
					]}
			]
		};
	}

	init() {
		this.$$("uploadFiles").attachEvent("onBeforeFileAdd", (obj) => {
			let id = this.getParam("id");
			let item = contacts.getItem(id);
			item.fileData = obj;
			item.fileData.changeDate = obj.file.lastModifiedDate;
			this.$$("files").add(item.fileData);
			this.$$("uploadFiles").stopUpload();
		});
	}

	urlChange() {
		webix.promise.all([
			contacts.waitData
		]).then(() => {
			let id = this.getParam("id");
			console.log(contacts.getItem(id).fileData);
		});
	}
}
