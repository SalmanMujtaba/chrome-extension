
log_file="/Volumes/projects/chrome extension/logs/file.log"
chrome_command="/Applications/Google Chrome.app"
url_to_open="https://ais.usvisa-info.com/en-ca/niv/groups/36762461"

open -na "$chrome_command" --args "$url_to_open" --new-tab

if [ $? -eq 0 ]; then
    echo "$(date): Script completed successfully." >> "$log_file"
else
    echo "$(date): Script encountered an error." >> "$log_file"
fi