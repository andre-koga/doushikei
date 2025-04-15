# Japanese Verb Extractor

This tool downloads and extracts Japanese verbs from JMdict for use in the conjugation app.

## Requirements

- Node.js (version 14 or later)
- npm or pnpm

## Setup

1. Navigate to the `scripts` directory:

   ```
   cd scripts
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   pnpm install
   ```

## Usage

Run the extractor:

```
npm run extract
```

or

```
pnpm run extract
```

This will:

1. Download the latest JMdict.gz file from the official source
2. Parse the XML and extract verb entries
3. Create a `verb-data.json` file in the `src/lib` directory with formatted verb data
4. The app will automatically use this data when it loads

## Configuration

You can modify settings in the `extract-verbs.js` file:

- `maxVerbs`: Maximum number of verbs to include (default: 500)
- `includeRareVerbs`: Whether to include rare or literary verbs (default: false)
- `outputPath`: Where to save the verb data file

## Troubleshooting

- **Download fails**: If the download fails, check your internet connection or try using a VPN if the Monash University FTP server is blocked.
- **Parse error**: If XML parsing fails, try downloading the JMdict file manually and placing it in the scripts directory.
- **No verbs found**: Increase the `maxVerbs` setting or set `includeRareVerbs` to true.

## Credits

- JMdict/EDICT is the property of the Electronic Dictionary Research and Development Group (EDRDG), and used in conformance with the license.
- More information at: https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project
