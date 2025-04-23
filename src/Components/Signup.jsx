// Signup.js
import { useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import '../Styles/Login+Sigup.css';  // استيراد ملف CSS الموحد

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        userId: user.uid,
        role: "user"
      });
      navigate("/login");
    } catch (error) {
      alert("خطأ أثناء التسجيل: " + error.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="container d-flex justify-content-center align-items-center">
        <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
          <h2 className="text-center mb-4">إنشاء حساب جديد</h2>
          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="الاسم الثلاثي"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Link to={"/login"} className="text-decoration-none"><p className="text-info text-center">هل لديك حساب بالفعل</p></Link>
            <button type="submit" className="btn btn-primary w-100">تسجيل</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
