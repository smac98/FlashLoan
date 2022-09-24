//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IUniswapV2Pair {
    function token0() external view returns (address);
    function token1() external view returns (address);
    function price0CumulativeLast() external view returns (uint);
    function price1CumulativeLast() external view returns (uint);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}

abstract contract IERC20Extented is IERC20 {
    function decimals() external view virtual returns (uint8);
}

abstract contract UniswapV2Factory  {
    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;
    function allPairsLength() external view virtual returns (uint);
}

// In order to quickly load up data from Uniswap-like market, this contract allows easy iteration with a single eth_call
contract FlashBotsUniswapQuery {
    address private manager;
    constructor()  {
    manager = msg.sender;
    }

    function getReservesByPairs(IUniswapV2Pair[] calldata _pairs) external view returns (uint256[3][] memory ,uint8[2][] memory) {
        uint256[3][] memory result = new uint256[3][](_pairs.length);
        uint8[2][] memory result2 = new uint8[2][](_pairs.length);
        for (uint i = 0; i < _pairs.length; i++) {
            (result[i][0], result[i][1], result[i][2]) = _pairs[i].getReserves();
            result2[i][0] = IERC20Extented(_pairs[i].token0()).decimals();
            result2[i][1] = IERC20Extented(_pairs[i].token1()).decimals();
        }
        return (result,result2);
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
   
    function getPairsByIndexRange(UniswapV2Factory _uniswapFactory, uint256 _start, uint256 _stop) external view returns (address[3][] memory)  {
        uint256 _allPairsLength = _uniswapFactory.allPairsLength();
        if (_stop > _allPairsLength) {
            _stop = _allPairsLength;
        }
        require(_stop >= _start, "start cannot be higher than stop");
        uint256 _qty = _stop - _start;
        address[3][] memory result = new address[3][](_qty);
        
        for (uint i = 0; i < _qty; i++) {
            IUniswapV2Pair _uniswapPair = IUniswapV2Pair(_uniswapFactory.allPairs(_start + i));
            result[i][0] = _uniswapPair.token0();
            result[i][1] = _uniswapPair.token1();
            result[i][2] = address(_uniswapPair);
        }
        return result;
    }
}
