import { Paper } from '@mui/material';
import image from '../../assets/food.png';


export default function AuthLayout({children}) {
    return <Paper style={{backgroundImage : `url(${image})`}}>
        {children}
    </Paper>
}
