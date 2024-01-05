import path from "path";

import {payloadCloud} from "@payloadcms/plugin-cloud";
import {mongooseAdapter} from "@payloadcms/db-mongodb"; // database-adapter-import
import {webpackBundler} from "@payloadcms/bundler-webpack"; // bundler-import
import {slateEditor} from "@payloadcms/richtext-slate"; // editor-import
import {buildConfig} from "payload/config";
import Users from "./collections/Users";
import imagekitPlugin from "payloadcms-plugin-imagekit";
import Media from "./collections/Media";

export default buildConfig({
	admin: {
		user: Users.slug,
		bundler: webpackBundler(), // bundler-config
	},
	editor: slateEditor({}), // editor-config
	collections: [Users, Media],
	typescript: {
		outputFile: path.resolve(__dirname, "payload-types.ts"),
	},
	graphQL: {
		schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
	},
	plugins: [
		payloadCloud(),
		imagekitPlugin({
			config: {
				publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
				privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
				endpoint: process.env.IMAGEKIT_ENDPOINT,
			},
			collections: {
				media: {
					disableLocalStorage: true,
					uploadOption: {
						folder: process.env.IMAGEKIT_FOLDER,
					},
					savedProperties: ["url"],
				},
			},
		}),
	],
	// database-adapter-config-start
	db: mongooseAdapter({
		url: process.env.DATABASE_URI,
	}),
	// database-adapter-config-end
});
