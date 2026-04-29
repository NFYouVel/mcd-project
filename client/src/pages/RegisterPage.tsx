import { useState } from 'react';
import { useNavigate } from 'react-router';
// import { registerRequest } from '../services/api';
import BackgroundLogin from '../components/BackgroundLogin';
import TextField from '@mui/material/TextField';
import { Button }  from '@mui/material';
import '../styles/login.css';

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [birthOfDate, setBirthOfDate] = useState('');

    // const handleRegister = async () => {
    //     try{
    //         const res = await registerRequest(
    //             name,
    //             email,
    //             password,
    //             address,
    //             birthOfDate
    //         );
    //         console.log(res);
    //         navigate("/");
    //     } catch (error) {
    //         console.error(error);
    //     }

    // };

    const handleLoginNavigation = () => {
        navigate("/login");
    };

    return (
           <div className="login-page">
            <BackgroundLogin />

            <div className="wrapper-login">

                {/* Left */}
                <div className="container-coffee"></div>

                {/* Right */}
                <div className="wrapper-form">

                    <div className="wrapper-login-logo">
                        <div className="login-logo"></div>
                    </div>

                    <div className="title-login">
                        <p>Create Account</p>
                        <span>Welcome to McDonald!</span>
                    </div>

                    <div className="wrapper-login-form">
                        <div className="form-login">

                            <TextField
                                label="Name"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={inputStyle}
                            />

                            <TextField
                                label="E-Mail"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={inputStyle}
                            />

                            <TextField
                                label="Address"
                                fullWidth
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                sx={inputStyle}
                            />

                            <TextField
                                label="birth of date"
                                fullWidth
                                value={birthOfDate}
                                onChange={(e) => setBirthOfDate(e.target.value)}
                                sx={inputStyle}
                            />

                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={inputStyle}
                            />

                        </div>
                    </div>

                    <div className="login-actions">

                        <div className="wrapper-login-button">
                            <Button
                                variant="contained"
                                // onClick={handleRegister}
                                className="button-login"
                                sx={{
                                    backgroundColor: "white",
                                    color: "black",
                                    borderRadius: "10px",
                                    "&:hover": {
                                        transform: "scale(1.03)",
                                        backgroundColor: "var(--pumpkin-essence)"
                                    }
                                }}
                            >
                                Register
                            </Button>
                        </div>

                        <p className="title-register">
                            Already have account?&nbsp;
                            <a
                                className="register-navigation"
                                onClick={handleLoginNavigation}
                            >
                                LOGIN NOW
                            </a>
                        </p>

                    </div>

                </div>
            </div>
        </div>
    );

}

const inputStyle = {
    marginBottom: "20px",
    input: { color: "#000000" },
    label: { color: "#000000" },
    "& label.Mui-focused": {
        color: "#000000",
    },
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        backgroundColor: "rgba(255,255,255,0.05)",
        "& fieldset": {
            borderColor: "#000000",
        },
        "&:hover fieldset": {
            borderColor: "#000000",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#000000",
            borderWidth: "2px",
        },
    },
};

export default Register;