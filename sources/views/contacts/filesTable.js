import {JetView} from "webix-jet";

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
						{id: "fileName", header: "Name", template: "", fillspace: true, sort: "string"},
						{id: "changeDate", header: "Change date", template: "", width: 150, sort: "date"},
						{id: "fileSize", header: "Size", template: "", sort: "string"},
						{id: "deleteFile", header: "", width: 50, template: "<span class='mdi mdi-trash-can'></span>", css: "delete_file"}
					],
					onClick: {
						delete_file: () => {
							webix.confirm({
								title: "Delete this file",
								text: "Are you sure you want to delete this file?"
							}).then(() => {
								// fileStorage.remove(id);
							});
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
							upload: "../models/fileStorage",
							on: {
								onItemClick: () => {
									console.log(this.$$("uploadFiles").data.pull);
								}
							}
						},
						{}
					]}
			]
		};
	}
}
