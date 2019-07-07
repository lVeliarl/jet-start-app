import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const header = {
			type: "header",
			localId: "header",
			template: this.app.config.name,
			css: "webix_header app_header"
		};

		const menu = {
			view: "menu",
			id: "top:menu",
			css: "app_menu",
			width: 180,
			layout: "y",
			select: true,
			template: "<div><span class='webix_icon #icon#'></span> #value#</div>",
			data: [
				{value: _("Contacts"), id: "contacts", icon: "mdi mdi-account-group"},
				{value: _("Activities"), id: "activities", icon: "mdi mdi-calendar-month"},
				{value: _("Settings"), id: "settings", icon: "mdi mdi-cogs"}
			],
			on: {
				onAfterSelect: (id) => {
					let topMenu = this.$$("top:menu");
					this.$$("header").setHTML(`<h2>${topMenu.getItem(id).value}</h2>`);
				}
			}
		};

		const ui = {
			type: "clean",
			paddingX: 5,
			css: "app_layout",
			rows: [
				header,
				{
					cols: [
						{
							rows: [menu],
							css: "sidebar"
						},
						{
							type: "wide",
							rows: [
								{$subview: true}
							]
						}
					]
				}
			]
		};

		return ui;
	}

	init() {
		this.use(plugins.Menu, "top:menu");
	}
}
