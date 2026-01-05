// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Nhập các thư viện ERC-20 và Ownable từ OpenZeppelin
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.9/contracts/access/Ownable.sol";

// Hợp đồng tùy chỉnh, kế thừa chức năng của ERC20 và Ownable
contract CustomERC20Token is ERC20, Ownable {

    // Số chữ số thập phân (Decimals) cho Stablecoin thường là 6 (giống USDC) 
    // hoặc 18 (mặc định của Ethereum). Chúng ta sẽ dùng 18 làm mặc định.
    uint8 internal constant DEFAULT_DECIMALS = 18;

    // Constructor: Chạy khi hợp đồng được triển khai
    // Cần 3 tham số: tên, ký hiệu, và tổng cung ban đầu
    constructor(
        string memory name_,        // Ví dụ: "Vietnam Dong Coin"
        string memory symbol_,      // Ví dụ: "VNDC"
        uint256 initialSupply       // Ví dụ: 1000000000000000000000 (1000 Token)
    ) 
    // Khởi tạo ERC20 với tên và ký hiệu
    ERC20(name_, symbol_) 
    // Khởi tạo Ownable, đặt người triển khai làm chủ sở hữu
    Ownable(msg.sender)
    {
        // Đúc số lượng token ban đầu cho người triển khai hợp đồng (msg.sender)
        _mint(msg.sender, initialSupply);
    }

    // ===============================================
    // CÁC CHỨC NĂNG BỔ SUNG
    // ===============================================

    // Hàm Đúc thêm Token (Minting):
    // Chỉ chủ sở hữu (người triển khai) mới có thể gọi hàm này.
    function mint(address to, uint256 amount) public onlyOwner {
        // Hàm _mint sẽ tăng tổng cung và thêm token vào tài khoản 'to'
        _mint(to, amount);
    }

    // Hàm Đốt Token (Burning):
    // Bất kỳ ai cũng có thể đốt token của chính họ.
    function burn(uint256 amount) public {
        // Hàm _burn sẽ giảm tổng cung và giảm token từ tài khoản người gọi
        _burn(msg.sender, amount);
    }

    // Hàm cập nhật Decimals (Tùy chọn):
    // Nếu bạn muốn hiển thị Decimals khác 18, cần dùng hàm này (nhưng không thể chỉnh sửa sau khi triển khai).
    // Tuy nhiên, việc thay đổi Decimals sau khi kế thừa ERC20 là phức tạp, nên chúng ta giữ 18 hoặc cấu hình 
    // lại hợp đồng nếu cần Decimals khác. Để đơn giản, chúng ta giữ mặc định 18.
}