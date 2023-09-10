unknown_args=()
while [[ $# -gt 0 ]]; do
    case "$1" in
        *) echo "$1"; shift ;;
    esac
done

echo "MY_ENV_VALUE_1=${MY_ENV_VALUE_1}"
echo "MY_ENV_VALUE_2=${MY_ENV_VALUE_2}"
echo "MY_ENV_VALUE_3=${MY_ENV_VALUE_3}"
