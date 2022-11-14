import { useEffect, useRef, useState } from "react";
import "./InfiniteScroll.css";
// import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const InfiniteScroll = () => {
  const [dataImg, setDataImg] = useState([[], [], []]);
  const [pageIndex, setPageIndex] = useState(1);
  const [searchState, setSearchState] = useState("random");

  const inputRef = useRef();

  const infiniteCheck = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollHeight - scrollTop <= clientHeight) {
      setPageIndex((pageIndex) => pageIndex + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", infiniteCheck);
    return () => {
      window.removeEventListener("scroll", infiniteCheck);
    };
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://api.unsplash.com/search/photos?page=${pageIndex}&per_page=30&query=${searchState}&client_id=4jTXo6fkSRYlKBaLU2fKM0S3Yi6xaK8CWpt8HtLWs0g`
      );
      console.log("API CALL");
      if (res.status === 200) {
        const imgsReceived = [];
        res.data.results.forEach((img) => {
          imgsReceived.push({ id: img.id, url: img.urls.regular });
        });
        const newFreshState = [
          [...dataImg[0]],
          [...dataImg[1]],
          [...dataImg[2]],
        ];
        let index = 0;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 10; j++) {
            newFreshState[i].push(imgsReceived[index]);
            index++;
          }
        }
        console.log(newFreshState);
        setDataImg(newFreshState);
      } else {
        console.log("Error API");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageIndex, searchState]);

  const handleSearch = (e) => {
    e.preventDefault();
    setDataImg([[], [], []]);
    setSearchState(inputRef.current.value);
    setPageIndex(1);
  };

  return (
    <div className="container">
      <form onSubmit={handleSearch}>
        <label htmlFor="search">Votre recherche</label>
        <input type="text" name="search" id="search" ref={inputRef} />
      </form>
      <div className="card-list">
        <div>
          {dataImg[0].map((img) => (
            <img key={img.id} src={img.url} alt="image unsplash" />
          ))}
        </div>
        <div>
          {dataImg[1].map((img) => (
            <img key={img.id} src={img.url} alt="image unsplash" />
          ))}
        </div>
        <div>
          {dataImg[2].map((img) => (
            <img key={img.id} src={img.url} alt="image unsplash" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteScroll;
