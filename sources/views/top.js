import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		let header = {
			type: "header",
			localId: "header",
			template: this.app.config.name,
			css: "webix_header app_header"
		};

		let menu = {
			view: "menu",
			id: "top:menu",
			css: "app_menu",
			width: 180,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{value: "Contacts", id: "Contacts", icon: "mdi mdi-account-group"},
				{value: "Activities", id: "Activities", icon: "mdi mdi-calendar-month"},
				{value: "Settings", id: "Settings", icon: "mdi mdi-cogs"}
			]
		};

		let ui = {
			type: "clean",
			paddingX: 5,
			css: "app_layout",
			rows: [
				header,
				{cols: [
					{
						paddingX: 5,
						paddingY: 10,
						rows: [menu]
					},
					{
						type: "wide",
						paddingY: 10,
						paddingX: 5,
						rows: [
							{$subview: true}
						]
					}
				]}
			]
		};

		return ui;
	}

	init() {
		this.use(plugins.Menu, "top:menu");
	}

	urlChange() {
		this.$$("header").setHTML(this.getUrl()[1].page);
	}
}
