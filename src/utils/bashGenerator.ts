/**
 * Generates an executable, standalone Bash script that runs an animated ASCII shark
 * directly inside the user's local terminal (macOS, Linux, WSL).
 */

export function generateLocalBashScript(sharkKind = "random"): string {
  return `#!/usr/bin/env bash
# ==============================================================================
# ASCII SHARKS CLI - Local Terminal Player
# Generated from stackedlol/ascii-sharks CLI Simulator
# ==============================================================================

set -e

# Terminal colors
CYAN='\\033[38;5;51m'
DEEP_CYAN='\\033[38;5;38m'
NAVY='\\033[38;5;25m'
GREEN='\\033[38;5;82m'
WHITE='\\033[1;37m'
GREY='\\033[38;5;245m'
DIM='\\033[38;5;238m'
RED='\\033[38;5;196m'
RESET='\\033[0m'
BOLD='\\033[1m'

# Cleanup on exit
cleanup() {
  printf "\\033[?25h" # show cursor
  printf "\\033[0m"
  clear
  echo -e "\${CYAN}>>> ASCII Sharks CLI session terminated. Fair winds!\${RESET}"
  exit 0
}
trap cleanup SIGINT SIGTERM

# Hide cursor and clear
printf "\\033[?25l"
clear

# Welcome banner
echo -e "\${CYAN}===================================================================\${RESET}"
echo -e "\${WHITE}\${BOLD}     _    ____   ____ ___ ___   ____  _   _    _    ____  _  ______\${RESET}"
echo -e "\${WHITE}\${BOLD}    / \\  / ___| / ___|_ _|_ _| / ___|| | | |  / \\  |  _ \\| |/ / ___|\${RESET}"
echo -e "\${CYAN}   / _ \\ \\___ \\| |    | | | |  \\___ \\| |_| | / _ \\ | |_) | ' /\\___ \\\${RESET}"
echo -e "\${CYAN}  / ___ \\ ___) | |___ | | | |   ___) |  _  |/ ___ \\|  _ <| . \\ ___) |\${RESET}"
echo -e "\${DEEP_CYAN} /_/   \\_\\____/ \\____|___|___| |____/|_| |_/_/   \\_\\_| \\_\\_|\\_\\____/\${RESET}"
echo -e "\${GREY}              A S C I I   O C E A N   S I M U L A T O R\${RESET}"
echo -e "\${CYAN}===================================================================\${RESET}"
echo -e "\${GREY}Press \${WHITE}[Ctrl+C]\${GREY} to surface / exit ocean mode.\${RESET}"
echo ""
sleep 1.2

# Animation frames
FRAMES=(
  "
                  _
                _/ \\
              _/ ..|\\
             (_\\  |_/
            /  \\@/  \\
           /     _   \\
       _.-'     / )   '-._
     .'  _.-'\\ ( ( /'-._  '.
    / .-'     \\_\\_\\/    '-. \\
   / /                     \\ \\
  / /   ___           ___   \\ \\
 (_/   /   \\         /   \\   \\_)
       \\___/         \\___/
"
  "
                   _
                 _/ \\
               _/ ..|\\
             .(_\\  |_/
            /  \\@/  \\
           /    /_)  \\
       _.-'    / /    '-._
     .'  _.-'\\ \\ \\ /'-._  '.
    / .-'     \\_\\_\\/    '-. \\
   / /                     \\ \\
  / /   ___           ___   \\ \\
 (_/   /   \\         /   \\   \\_)
       \\___/         \\___/
"
  "
                    _
                  _/ \\
                _/ ..|\\
              .(_\\  |_/
             /  \\@/  \\
            /    (_\\  \\
        _.-'      \\ \\  '-._
      .'  _.-'\\   ) ) /'-._  '.
     / .-'     \\_\\_\\/    '-. \\
    / /                     \\ \\
   / /   ___           ___   \\ \\
  (_/   /   \\         /   \\   \\_)
        \\___/         \\___/
"
  "
                   _
                 _/ \\
               _/ ..|\\
              (_\\  |_/
             /  \\@/  \\
            /     _   \\
        _.-'     ( \\   '-._
      .'  _.-'\\   ) ) /'-._  '.
     / .-'     \\_\\_\\/    '-. \\
    / /                     \\ \\
   / /   ___           ___   \\ \\
  (_/   /   \\         /   \\   \\_)
        \\___/         \\___/
"
)

# Species list
KINDS=("classic (Great White)" "hammerhead (Cephalofoil)" "mako (Oceanic Missile)" "thresher (Whip Tail)" "tiger (Striped Hunter)")
CURRENT_KIND="\${KINDS[$RANDOM % \${#KINDS[@]}]}"

STEP=0
DIR=1
POS=4
MAX_COL=$(tput cols || echo 80)
[ "$MAX_COL" -lt 60 ] && MAX_COL=60
MAX_POS=$((MAX_COL - 45))

while true; do
  clear
  FRAME_IDX=$((STEP % 4))
  CURRENT_FRAME="\${FRAMES[$FRAME_IDX]}"

  echo -e "\${NAVY}~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\${RESET}"
  echo -e "\${CYAN}[CLI OCEAN ENGINE]\${GREY} SPECIES: \${WHITE}\$CURRENT_KIND\${GREY} | DEPTH: \${DEEP_CYAN}140m\${GREY} | SPEED: \${GREEN}32kn\${GREY} | CTRL+C TO QUIT\${RESET}"
  echo -e "\${NAVY}~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\${RESET}"
  
  # Fish schools in foreground
  echo -e "\${DIM} .      -   -       .         ~    ~      -            .          -     -   .      ~      \${RESET}"
  echo -e "\${DEEP_CYAN}    ~               -     -                 .       ~         -     -              .    \${RESET}"

  # Print indented shark frame
  INDENT=$(printf '%*s' "$POS" '')
  echo -e "\${WHITE}"
  while IFS= read -r line; do
    echo -e "\${INDENT}\${CYAN}\$line\${RESET}"
  done <<< "$CURRENT_FRAME"

  # Sea floor / bubbles
  echo -e "\${DIM}        .        o       O         .         o          .        O       o       .      \${RESET}"
  echo -e "\${NAVY}==================================================================================================\${RESET}"
  echo -e "\${GREY}  [ASCII Sharks CLI] Press \${WHITE}Ctrl+C\${GREY} to exit terminal simulation.\${RESET}"

  # Move position back and forth
  POS=$((POS + DIR))
  if [ "$POS" -ge "$MAX_POS" ]; then
    DIR=-1
    CURRENT_KIND="\${KINDS[$RANDOM % \${#KINDS[@]}]}"
  elif [ "$POS" -le 2 ]; then
    DIR=1
  fi

  STEP=$((STEP + 1))
  sleep 0.12
done
`;
}
