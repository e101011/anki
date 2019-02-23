mv ~/Downloads/anki_*.mp3 /Users/*/Library/Application\ Support/Anki2/script/collection.media

osascript <<EOD
  tell application "Anki"
      launch
      delay 1.0
  end tell
  tell application "System Events"
      key code 125
      key code 36
      key code {55, 56, 34}
      key code {55, 56, 5}
      delay 1.0
      keystroke "~/Downloads"
      key code {76}
      keystroke "anki_dictionary"
      key code {76}
      delay 1.5
      key code {76}
      delay 1.5
      key code {76}
      quit application "Anki"
  end tell
EOD
