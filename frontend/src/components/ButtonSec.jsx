import { Button } from '@cred/neopop-web/lib/components';

const ButtonSec = () => (
    <Button
        variant="primary"
        kind="elevated"
        size="big"
        colorMode="dark"
        onClick={() => {
            console.log("I'm clicked");
        }}
    >
        Primary
    </Button>
)

export default ButtonSec